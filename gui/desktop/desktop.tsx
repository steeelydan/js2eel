import { render } from 'preact';

import '../src/style.css';
import { DesktopApp } from '../src/components/DesktopApp';

render(<DesktopApp />, document.getElementById('app') as HTMLElement);
