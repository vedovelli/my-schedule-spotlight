import { describe, expect, it } from 'vitest';
import { render, screen } from './test-utils';

import { Button } from '@/components/ui/button';

describe('Test Environment Setup', () => {
  it('should render a button component', () => {
    render(<Button>Test Button</Button>);

    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  it('should have working jest-dom matchers', () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
