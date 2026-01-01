# TODO Web Application

A modern, standalone TODO application built with vanilla HTML, CSS, and JavaScript.

## Features

- ✅ Add, edit, delete TODO items
- ✅ Mark items as complete/incomplete
- ✅ Filter by All/Active/Completed
- ✅ Clear completed items
- ✅ Dark mode support
- ✅ LocalStorage persistence
- ✅ Smooth animations
- ✅ Keyboard shortcuts
- ✅ Responsive design
- ✅ Accessibility support

## Usage

Simply open `index.html` in any modern web browser. No build tools or server required!

```bash
# Navigate to the directory
cd todo

# Open in your default browser (Windows)
start index.html

# Or just double-click index.html in your file explorer
```

## How to Use

### Adding a TODO
1. Type your task in the input field
2. Press Enter or click the "Add" button

### Completing a TODO
- Click the checkbox next to the task

### Editing a TODO
- Double-click on the task text, or
- Click the edit button (✏️) when hovering over the task
- Press Enter to save, Escape to cancel

### Deleting a TODO
- Click the delete button (🗑️) when hovering over the task

### Filtering TODOs
- Click "All" to see all tasks
- Click "Active" to see only incomplete tasks
- Click "Completed" to see only completed tasks

### Dark Mode
- Click the sun/moon icon in the header to toggle dark mode
- Your preference is saved automatically

### Clear Completed
- Click "Clear Completed" button at the bottom to remove all completed tasks
- You'll be asked to confirm before deletion

## Keyboard Shortcuts

- **Enter**: Add new TODO (when input is focused)
- **Enter**: Save edit (when editing)
- **Escape**: Cancel edit
- **Double-click**: Edit TODO item

## Technical Details

### File Structure
```
todo/
├── index.html    # Main HTML structure
├── styles.css    # All styling with CSS variables
├── app.js        # Application logic
└── README.md     # This file
```

### Browser Support

Works in all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

Requires JavaScript enabled and LocalStorage support.

### Data Storage

All your TODOs are stored locally in your browser's LocalStorage. This means:
- ✅ Data persists after closing the browser
- ✅ No internet connection required
- ✅ Complete privacy - data never leaves your device
- ⚠️ Clearing browser data will delete your TODOs
- ⚠️ TODOs are not synced across devices

## Design Features

### Glassmorphism UI
The app uses modern glassmorphism design with:
- Translucent backgrounds
- Backdrop blur effects
- Smooth shadows and gradients

### Animations
- Smooth slide-in when adding tasks
- Smooth slide-out when deleting tasks
- Hover effects with transforms
- Seamless dark mode transitions

### Accessibility
- Semantic HTML5 elements
- ARIA labels for screen readers
- Keyboard navigation support
- Proper color contrast ratios
- Focus indicators

### Responsive Design
The app adapts to different screen sizes:
- Desktop: Full-featured layout
- Tablet: Optimized spacing
- Mobile: Stacked layout with full-width buttons

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:

```css
:root {
  --accent-primary: #667eea;  /* Main accent color */
  --accent-secondary: #764ba2; /* Secondary accent */
  /* ... more variables */
}
```

### Changing Animations
Modify the `@keyframes` in `styles.css`:

```css
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
```

## Credits

UI patterns inspired by modern web design principles including:
- Glassmorphism effects
- Smooth micro-interactions
- Dark mode best practices
- Accessibility guidelines (WCAG 2.1)

## License

Free to use and modify for personal or commercial projects.
