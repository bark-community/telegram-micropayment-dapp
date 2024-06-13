import { render, screen } from '@testing-library/react';
import Plate from './Plate';

describe('ui/Plate', () => {
  test('should render component with default tag', () => {
    // Define the content to be rendered inside the Plate component
    const content = 'This is simple content';
    // Render the Plate component with the defined content
    render(<Plate>{content}</Plate>);

    // Find the rendered content within the component
    const children = screen.getByText(content);
    // Assert that the content is rendered
    expect(children).toBeInTheDocument();
    // Assert that the parent element of the content has the default tag (div)
    expect(children.parentElement.nodeName.toLowerCase()).toEqual('div');
  });

  test('should render component with custom tag', () => {
    // Define the content to be rendered inside the Plate component
    const content = 'Custom tag';
    // Define the custom tag to be used for rendering the Plate component
    const customTag = 'section';
    // Render the Plate component with the defined content and custom tag
    render(<Plate as={customTag}>{content}</Plate>);

    // Find the rendered content within the component
    const children = screen.getByText(content);
    // Assert that the content is rendered
    expect(children).toBeInTheDocument();
    // Assert that the parent element of the content has the custom tag specified
    expect(children.parentElement.nodeName.toLowerCase()).toEqual(customTag);
  });
});
