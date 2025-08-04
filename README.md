# TaskFlow - Personal To-Do List Application

A beautiful, responsive, and fully-featured to-do list application built with vanilla HTML, CSS, and JavaScript. TaskFlow provides an intuitive interface for managing daily tasks with local storage persistence.

## Features

### Core Functionality
- ✅ **Add Tasks**: Create new tasks with validation for empty inputs
- ✅ **Edit Tasks**: In-line editing with save/cancel options
- ✅ **Delete Tasks**: Remove tasks with confirmation dialog
- ✅ **Complete Tasks**: Mark tasks as done with visual feedback
- ✅ **Local Storage**: All data persists between browser sessions
- ✅ **Task Filtering**: View all, active, or completed tasks
- ✅ **Task Counter**: Real-time count of total and completed tasks

### User Experience
- 🎨 **Beautiful Design**: Modern, clean interface with gradient backgrounds
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- ♿ **Accessible**: Keyboard navigation, screen reader support, high contrast mode
- 🚀 **Smooth Animations**: Subtle transitions and micro-interactions
- 🎯 **Intuitive Controls**: Clear visual feedback and error messaging
- 🔒 **Data Validation**: Prevents empty tasks and enforces character limits

### Technical Features
- 📦 **No Dependencies**: Pure vanilla JavaScript, HTML, and CSS
- 💾 **Local Storage**: Client-side data persistence
- 🔧 **Modular Code**: Clean, well-organized, and commented codebase
- 🎪 **Cross-Browser**: Compatible with all modern browsers
- 📐 **Semantic HTML**: Proper markup structure for accessibility
- 🎨 **CSS Custom Properties**: Consistent design system with variables

## Getting Started

1. **Download or Clone**: Get the project files to your local machine
2. **Open**: Simply open `index.html` in any modern web browser
3. **Start Using**: Begin adding your tasks immediately - no setup required!

## File Structure

```
TaskFlow/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design  
├── app.js             # JavaScript functionality and logic
└── README.md          # Project documentation
```

## Browser Support

TaskFlow works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Usage

### Adding Tasks
1. Type your task in the input field
2. Click "Add Task" or press Enter
3. Your task appears at the top of the list

### Managing Tasks
- **Complete**: Click the checkbox to mark as done
- **Edit**: Click "Edit" to modify the task text
- **Delete**: Click "Delete" and confirm to remove permanently

### Filtering Tasks
Use the filter buttons to view:
- **All**: Show all tasks
- **Active**: Show only incomplete tasks  
- **Completed**: Show only finished tasks

## Customization

The app uses CSS custom properties (variables) for easy theming. Key variables include:

```css
:root {
    --primary-500: #3b82f6;    /* Primary blue */
    --success-500: #10b981;    /* Success green */
    --error-500: #ef4444;      /* Error red */
    /* ... and many more */
}
```

## Data Storage

Tasks are automatically saved to your browser's local storage, including:
- Task text and completion status
- Creation and completion timestamps
- Edit history and task order

## Accessibility Features

- Full keyboard navigation support
- Screen reader compatible with ARIA labels
- High contrast mode support
- Focus indicators for all interactive elements
- Semantic HTML structure

## Performance

- **Instant Loading**: No external dependencies or API calls
- **Smooth Interactions**: Optimized animations and transitions
- **Memory Efficient**: Clean DOM manipulation and event handling
- **Mobile Optimized**: Touch-friendly interface with appropriate sizing

## Contributing

This is a vanilla JavaScript project perfect for learning and customization. Feel free to:

- Add new features (due dates, categories, etc.)
- Improve the design and animations
- Enhance accessibility features
- Add keyboard shortcuts
- Implement data export/import

## License

This project is open source and available under the MIT License.

---

**TaskFlow** - Simple task management for productive days ✨
