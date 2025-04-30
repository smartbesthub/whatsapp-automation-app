const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function sendWhatsAppMessage(phoneNumber, message) {
    let options = new chrome.Options();
    // Disable headless mode for testing in a visible browser window
    // options.addArguments('headless'); // Keep this line commented out for visible browser
    
    options.addArguments('disable-gpu');
    options.addArguments('no-sandbox');  // Required by Heroku for headless (even though we're not using headless now)

    let driver;
    try {
        console.log("Starting Chrome Driver...");
        // Start the Chrome WebDriver with given options
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Open WhatsApp Web using the wa.me URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        console.log("Opening WhatsApp Web...");
        // Open WhatsApp Web
        await driver.get(whatsappURL); 

        // Wait for the QR code or page to load (increase wait time if needed)
        console.log("Waiting for QR code...");
        await driver.wait(until.elementLocated(By.css('div[data-testid="qr-code"]')), 60000);  // Wait for QR code
        console.log("QR code found!");

        console.log("Waiting for Send button...");
        await driver.wait(until.elementLocated(By.css('span[data-icon="send"]')), 60000);  // Wait for send button
        console.log("Send button found!");

        // Capture a screenshot on timeout or error for debugging
        await driver.takeScreenshot().then(function(data) {
            fs.writeFileSync('screenshot.png', data, 'base64');
        });

        // Try clicking the send button
        console.log("Clicking send button...");
        await driver.findElement(By.css('span[data-icon="send"]')).click();
        
        console.log(`Message sent to ${phoneNumber}`);
    } catch (error) {
        // Handle any errors in the process
        console.error('Error during WhatsApp message automation:', error);
    } finally {
        // Ensure the browser is closed even if the process fails
        if (driver) {
            await driver.quit();
        }
    }
}

// Example Usage
sendWhatsAppMessage('2349027660119', 'Hello, your order has been placed!');
