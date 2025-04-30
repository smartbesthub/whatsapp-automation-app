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
        // Start the Chrome WebDriver with given options
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Open WhatsApp Web using the wa.me URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp Web
        await driver.get(whatsappURL); 

        // Wait for QR code to be located and send button to be ready
        await driver.wait(until.elementLocated(By.css('div[data-testid="qr-code"]')), 60000);  // Wait for QR code
        await driver.wait(until.elementLocated(By.css('span[data-icon="send"]')), 60000);  // Wait for send button

        // Capture a screenshot of the browser for debugging purposes
        await driver.takeScreenshot().then(function(data) {
            fs.writeFileSync('screenshot.png', data, 'base64');
        });

        // Click the send button after waiting
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
