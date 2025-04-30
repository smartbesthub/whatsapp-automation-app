const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function sendWhatsAppMessage(phoneNumber, message) {
    let options = new chrome.Options();
    // Remove the headless argument to run in non-headless mode
    // options.addArguments('headless'); // This is removed to make the browser visible
    options.addArguments('disable-gpu');
    options.addArguments('no-sandbox');  // Required by Heroku for headless (even though we're not using headless now)

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Open WhatsApp Web using the wa.me URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        await driver.get(whatsappURL);  // Open WhatsApp Web with the message pre-filled

        // Wait for the QR code or page to load (increase wait time if needed)
        await driver.wait(until.elementLocated(By.css('div[data-testid="qr-code"]')), 60000);  // Wait for QR code to load
        await driver.wait(until.elementLocated(By.css('span[data-icon="send"]')), 60000);  // Wait for send button

        // Capture a screenshot on timeout or error for debugging
        await driver.takeScreenshot().then(function(data) {
            fs.writeFileSync('screenshot.png', data, 'base64');
        });

        // Try clicking the send button
        await driver.findElement(By.css('span[data-icon="send"]')).click();
        
        console.log(`Message sent to ${phoneNumber}`);
    } catch (error) {
        console.error('Error during WhatsApp message automation:', error);
    } finally {
        // Close the browser
        await driver.quit();
    }
}

// Example Usage
sendWhatsAppMessage('2349027660119', 'Hello, your order has been placed!');
