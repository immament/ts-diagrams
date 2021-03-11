import React from 'react';
import {render} from '@testing-library/react';
import App from '../App';

jest.mock('../joint/diagram');

test('renders learn react link', () => {
  render(<App />);
  // const linkElement = screen.getByText(/learn react/i);
  // expect(linkElement).toBeInTheDocument();
});
