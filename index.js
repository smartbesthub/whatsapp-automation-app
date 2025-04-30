const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

async function sendWhatsAppMessage(phoneNumber, message) {
    let options = new chrome.Options();
    options.addArguments('headless');  // Headless mode
    options.addArguments('disable-gpu');
    options.addArguments('no-sandbox');  // Required by Heroku for headless

    let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

    try {
        // Open WhatsApp Web using the wa.me URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        await driver.get(whatsappURL);  // Open WhatsApp Web with the message pre-filled

        // Wait for the QR code or page to load (increase wait time if needed)
        await driver.wait(until.elementLocated(By.css('div[title="Scan me!"]')), 30000);  // Wait for QR code
        await driver.wait(until.elementLocated(By.css('span[data-icon="send"]')), 30000);  // Wait for the Send button

        // Take a screenshot in case of timeout or error for debugging
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
