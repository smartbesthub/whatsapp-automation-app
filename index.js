const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function sendWhatsAppMessage(phoneNumber, message) {
    let options = new chrome.Options();
    options.addArguments('headless');  // Ensure it's running headless (no UI)
    options.addArguments('disable-gpu');
    options.addArguments('no-sandbox');  // Required by Heroku for headless

    let driver;
    try {
        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

        // Open WhatsApp Web using the wa.me URL
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        await driver.get(whatsappURL);  // This will open WhatsApp Web with the message pre-filled
        
        // Wait for the page to load and for the send button to appear
        await driver.wait(until.elementLocated(By.css('div[title="Send"]')), 10000);

        // Click the send button
        await driver.findElement(By.css('div[title="Send"]')).click();

        console.log(`Message sent to ${phoneNumber}`);
    } catch (error) {
        console.error('Error during WhatsApp message automation:', error);
    } finally {
        // Ensure the browser is properly closed in case of errors
        if (driver) {
            await driver.quit();
        }
    }
}

// Example Usage:
sendWhatsAppMessage('1234567890', 'Hello, your order has been placed!');
