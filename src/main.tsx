import { AppRegistry } from 'react-native';
import App from './App';
import './index.css';
import { bugDetector } from './services/bugDetector';

// Initialize the automated Bug Detection and Terminal Telemetry Engine
bugDetector.init();

// Register the React Native App
AppRegistry.registerComponent('App', () => App);

// Mount using React Native AppRegistry to the root container
const rootElement = document.getElementById('root');
if (rootElement) {
  AppRegistry.runApplication('App', {
    initialProps: {},
    rootTag: rootElement as unknown as any,
  });
}
