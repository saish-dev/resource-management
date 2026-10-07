import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { personStatusSchema } from '@rm/shared';
import {
  Button,
  Card,
  Modal,
  ProgressBar,
  StatusLozenge,
  Table,
  Tag,
  Td,
  Th,
  ToastProvider,
  useToast,
} from '.';

describe('Button', () => {
  it('defaults to type=button so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute(
      'type',
      'button',
    );
  });

  it('does not fire onClick when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('StatusLozenge', () => {
  it.each([
    ['AVAILABLE', 'Available'],
    ['ALLOCATED', 'Allocated'],
    ['LOCKED_TENTATIVE', 'Locked, tentative'],
    ['LOCKED_CONFIRMED', 'Locked, confirmed'],
    ['ON_LEAVE', 'On leave'],
    ['BENCH', 'On bench'],
  ] as const)('shows the text for %s, not just a colour', (status, label) => {
    render(<StatusLozenge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('has a label for every status', () => {
    for (const status of personStatusSchema.options) {
      const { unmount } = render(<StatusLozenge status={status} />);
      expect(document.body.textContent).not.toBe('');
      unmount();
    }
  });
});

describe('ProgressBar', () => {
  it('exposes the value to assistive tech', () => {
    render(<ProgressBar value={60} label="Utilisation" />);
    const bar = screen.getByRole('progressbar', { name: 'Utilisation' });
    expect(bar).toHaveAttribute('aria-valuenow', '60');
    expect(bar).toHaveAttribute('aria-valuetext', '60%');
  });

  it('uses the danger style above 100% and still shows the real number', () => {
    render(<ProgressBar value={120} label="Utilisation" />);
    expect(screen.getByRole('progressbar')).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
    expect(screen.getByText('120%')).toHaveClass('text-danger-fg');
  });
});

describe('Tag', () => {
  it('removes via a labelled button', async () => {
    const onRemove = vi.fn();
    render(<Tag onRemove={onRemove}>Java</Tag>);
    await userEvent.click(screen.getByRole('button', { name: 'Remove Java' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe('Table', () => {
  it('has a caption and column headers with scope', () => {
    render(
      <Table caption="People">
        <thead>
          <tr>
            <Th>Name</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Anita</Td>
          </tr>
        </tbody>
      </Table>,
    );
    expect(screen.getByRole('table', { name: 'People' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'scope',
      'col',
    );
  });
});

describe('Card', () => {
  it('renders a titled section', () => {
    render(<Card title="Buttons">body</Card>);
    expect(
      screen.getByRole('heading', { name: 'Buttons' }),
    ).toBeInTheDocument();
  });
});

describe('Modal', () => {
  it('opens, is labelled by its title and reports close', () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <Modal open={false} onClose={onClose} title="Confirm">
        body
      </Modal>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    rerender(
      <Modal open onClose={onClose} title="Confirm">
        body
      </Modal>,
    );
    expect(screen.getByRole('dialog', { name: 'Confirm' })).toBeInTheDocument();
    rerender(
      <Modal open={false} onClose={onClose} title="Confirm">
        body
      </Modal>,
    );
    expect(onClose).toHaveBeenCalled();
  });
});

describe('Toast', () => {
  function Trigger() {
    const toast = useToast();
    return <button onClick={() => toast('Allocation saved')}>go</button>;
  }

  it('announces the message in a polite live region and auto-dismisses', async () => {
    vi.useFakeTimers();
    render(
      <ToastProvider durationMs={1000}>
        <Trigger />
      </ToastProvider>,
    );
    act(() => screen.getByText('go').click());
    expect(screen.getByRole('status')).toHaveTextContent('Allocation saved');
    act(() => vi.advanceTimersByTime(1001));
    expect(screen.getByRole('status')).not.toHaveTextContent(
      'Allocation saved',
    );
    vi.useRealTimers();
  });

  it('can be dismissed by the user', async () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText('go'));
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.getByRole('status')).not.toHaveTextContent(
      'Allocation saved',
    );
  });
});
