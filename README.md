# Pokemon Center Queue Monitor Extension 🎮

A Chrome extension that displays your queue position when waiting in Pokemon Center's virtual queue system. No more constantly checking the Network tab in Developer Tools!

## Features ✨

- **Real-time Queue Position**: Shows your current position in the queue as a badge on the extension icon
- **Detailed Status Info**: Click the extension to see:
  - Your exact position in line
  - Queue status (In Queue/Waiting)
  - Estimated wait time (when available)
  - Last update timestamp
- **Auto-refresh**: Automatically updates as your position changes
- **Visual Indicators**: Badge turns green with a checkmark when you're through the queue
- **Smart Number Formatting**: Large numbers are shortened (e.g., "23k" for 23,000)

## Installation 🚀

### Method 1: Load Unpacked Extension (Recommended for Development)

1. **Download or Clone this Repository**
   ```bash
   git clone https://github.com/yourusername/pokemon-center-queue-monitor.git
   ```
   Or download as ZIP and extract it

2. **Open Chrome Extension Management**
   - Open Chrome browser
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" toggle in the top right

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the folder containing the extension files
   - The extension will appear in your toolbar with a Pokeball icon

### Method 2: Manual File Creation

1. Create a new folder called `pokemon-queue-monitor`
2. Create the following files in that folder:
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `popup.html`
   - `popup.js`
3. Copy the code from each file in this repository
4. Add icon files (16x16, 48x48, 128x128 pixels) or use placeholder images
5. Follow steps 2-3 from Method 1 above

## File Structure 📁

```
pokemon-queue-monitor/
├── manifest.json       # Extension configuration
├── background.js       # Service worker for monitoring network requests
├── content.js         # Content script injected into Pokemon Center pages
├── popup.html         # Extension popup UI
├── popup.js           # Popup functionality
├── icon16.png         # Toolbar icon (16x16)
├── icon48.png         # Extension icon (48x48)
└── icon128.png        # Store icon (128x128)
```

## Usage 📖

1. **Navigate to Pokemon Center**: Go to [pokemoncenter.com](https://www.pokemoncenter.com)
2. **Enter Queue**: When the site is busy, you'll be placed in a virtual queue
3. **Monitor Position**: Your position will automatically appear as a badge on the extension icon
4. **Check Details**: Click the extension icon to see detailed information
5. **Wait**: The extension will update automatically as your position improves
6. **Shop**: When you reach position 0, the badge will turn green and you can access the store!

## How It Works 🔧

The extension monitors network responses from Pokemon Center's Incapsula/Imperva queue system. When it detects queue data in the format:

```json
{
  "pos": 23082,
  "pending": 1,
  "ttw": 8,
  "rld": 0
}
```

It extracts and displays:
- `pos`: Your position in line
- `pending`: Queue status (1 = in queue)
- `ttw`: Estimated time to wait (in minutes)

## Icons 🎨

You'll need to provide Pokeball icon images in three sizes:
- `icon16.png` - 16x16 pixels (toolbar)
- `icon48.png` - 48x48 pixels (extensions page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

Free Pokeball icons available at:
- [IconFinder](https://www.iconfinder.com/search?q=pokeball)
- [Icon-Icons](https://icon-icons.com/search/icons/?filtro=pokeball)
- [Flaticon](https://www.flaticon.com/search?word=pokeball)

## Troubleshooting 🔨

### Extension Not Showing Queue Position
- Make sure you're on pokemoncenter.com
- Check that the site has actually placed you in a queue
- Refresh the page if needed
- Check Chrome console for any errors

### Weird Characters in Display
- Ensure all files are saved with UTF-8 encoding
- Remove any emoji characters if they're not displaying correctly
- Use plain text alternatives for icons

### Badge Not Updating
- The queue system must be active (typically during high-traffic events)
- Try refreshing the Pokemon Center page
- Check that the extension has proper permissions

## Development 💻

### Testing Locally
1. Make your changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Test on pokemoncenter.com

### Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## Disclaimer ⚠️

This extension is for **educational and convenience purposes only**. It:
- ✅ Only reads data already sent to your browser
- ✅ Does not bypass any security measures
- ✅ Does not provide any unfair advantage
- ✅ Does not automate any purchases
- ✅ Complies with website terms of service

The extension simply displays queue information in a more convenient format than having Developer Tools open.

## Privacy Policy 🔒

This extension:
- Does not collect any personal data
- Does not transmit any data to external servers
- Only reads Pokemon Center queue responses
- Stores queue position locally in browser storage
- All processing happens locally in your browser

## License 📄

MIT License - See [LICENSE](LICENSE) file for details

## Support 💬

If you encounter any issues or have suggestions:
1. Open an issue on GitHub
2. Provide details about the problem
3. Include any error messages from the Chrome console

## Acknowledgments 🙏

- Pokemon and Pokemon Center are trademarks of The Pokémon Company
- This extension is not affiliated with or endorsed by The Pokémon Company
- Queue system powered by Imperva/Incapsula

---

## Privacy Policy

### Data Collection
Pokemon Center Queue Monitor does NOT collect, store, or transmit any personal data. 

### What the Extension Does
- **Reads**: Queue position data from Pokemon Center's Incapsula system
- **Stores**: Queue position and timestamp locally in browser storage (never transmitted)
- **Displays**: Your queue position as a badge and in the popup

### What the Extension Does NOT Do
- Does not collect personal information
- Does not track browsing history
- Does not send data to external servers
- Does not store data beyond the current session
- Does not access any account information
- Does not use cookies or analytics
- Does not sell or share any data

### Permissions Used
- **webRequest**: To read queue responses from Pokemon Center
- **storage**: To temporarily store queue position locally
- **tabs**: To check if you're on Pokemon Center website
- **webNavigation**: To detect when you've entered the site
- **Host permission**: To inject monitoring script on Pokemon Center pages only

### Data Retention
Queue position data is stored temporarily in browser local storage and is automatically cleared when:
- You close the Pokemon Center tab
- You successfully enter the store
- The browser is closed

### Contact
For any privacy concerns or questions, please open an issue on GitHub or contact ding.developer1@gmail.com

### Changes to Privacy Policy
Any changes to this privacy policy will be posted on this GitHub page with an updated revision date.

Last Updated: September 2024

Made with ❤️ for Pokemon collectors who are tired of checking Developer Tools

**Note**: This extension is most useful during high-traffic events like special releases when the queue system is active. During normal shopping, you won't see a queue position.
