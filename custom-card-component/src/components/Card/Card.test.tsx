import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Card from './Card';
import { CardProps } from './Card.types';

describe('Card Component', () => {
  const defaultProps: CardProps = {
    title: 'Test Title',
    description: 'Test Description',
  } as CardProps;

  test('renders the card with title and description', () => {
    const { getByText } = render(<Card {...defaultProps} />);
    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Description')).toBeInTheDocument();
  });

  test('renders left and right icons', () => {
    const { getByText } = render(<Card {...defaultProps} leftIcon={<span>L</span>} rightIcon={<span>R</span>} />);
    expect(getByText('L')).toBeInTheDocument();
    expect(getByText('R')).toBeInTheDocument();
  });

  test('applies different sizes', () => {
    const { rerender, getByTestId } = render(<Card {...defaultProps} size="sm" data-testid="card" />);
    expect(getByTestId('card')).toHaveClass('card--sm');

    rerender(<Card {...defaultProps} size="xl" data-testid="card" />);
    expect(getByTestId('card')).toHaveClass('card--xl');
  });

  test('applies custom colors to title and description', () => {
    const { getByText } = render(
      <Card {...defaultProps} titleColor="#ff0000" descriptionColor="rgb(0,128,0)" />
    );

    const title = getByText('Test Title');
    const description = getByText('Test Description');

    expect(title).toHaveStyle({ color: '#ff0000' });
    expect(description).toHaveStyle({ color: 'rgb(0,128,0)' });
  });

  test('variant filled and background color', () => {
    const { getByTestId } = render(<Card {...defaultProps} variant="filled" backgroundColor="#faf0" data-testid="card" />);
    expect(getByTestId('card')).toHaveClass('card--filled');
  });

  test('onClick and disabled behavior', () => {
    const handle = jest.fn();
    const { getByTestId } = render(<Card {...defaultProps} onClick={handle} data-testid="card" />);
    fireEvent.click(getByTestId('card'));
    expect(handle).toHaveBeenCalled();

    const { getByTestId: g2 } = render(<Card {...defaultProps} onClick={handle} disabled data-testid="card2" />);
    fireEvent.click(g2('card2'));
    expect(handle).toHaveBeenCalledTimes(1); // not called again
  });

  test('calls onDownload when provided and includes colors', async () => {
    const onDownload = jest.fn();
    const { getByText } = render(<Card {...defaultProps} showActions onDownload={onDownload} titleColor="#ff0000" backgroundColor="#00ff00" />);
    fireEvent.click(getByText('Baixar'));
    expect(onDownload).toHaveBeenCalled();
    const html = onDownload.mock.calls[0][1] as string;
    expect(html).toContain('Test Title');
    expect(html).toContain('#ff0000');
    expect(html).toContain('#00ff00');
  });

  test('triggers anchor click to download when no onDownload', () => {
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const origCreate = (URL as any).createObjectURL;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (URL as any).createObjectURL = jest.fn(() => 'blob:fake');
    const { getByText } = render(<Card {...defaultProps} showActions />);
    fireEvent.click(getByText('Baixar'));
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (URL as any).createObjectURL = origCreate;
  });
});