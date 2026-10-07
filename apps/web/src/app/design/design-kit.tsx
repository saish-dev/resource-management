'use client';

import { useState } from 'react';
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
  ThemeToggle,
  Th,
  Tr,
  useToast,
} from '@/components/ui';

export function DesignKit() {
  const [open, setOpen] = useState(false);
  const toast = useToast();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Design kit</h1>
        <ThemeToggle />
      </div>

      <Card title="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Allocate</Button>
          <Button>Cancel</Button>
          <Button variant="subtle">Subtle</Button>
          <Button variant="danger">Release</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button size="compact">Compact</Button>
        </div>
      </Card>

      <Card title="Status lozenges and tags">
        <div className="flex flex-wrap items-center gap-2">
          {personStatusSchema.options.map((s) => (
            <StatusLozenge key={s} status={s} />
          ))}
          <Tag>Java</Tag>
          <Tag onRemove={() => {}}>AWS</Tag>
        </div>
      </Card>

      <Card title="Utilisation">
        <div className="flex flex-col gap-2">
          <ProgressBar value={40} label="Utilisation 40%" />
          <ProgressBar value={100} label="Utilisation 100%" />
          <ProgressBar value={120} label="Utilisation 120%" />
        </div>
      </Card>

      <Card title="Table">
        <Table caption="People">
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th>Utilisation</Th>
            </tr>
          </thead>
          <tbody>
            <Tr>
              <Td>Anita Raghavan</Td>
              <Td>
                <StatusLozenge status="ALLOCATED" />
              </Td>
              <Td>
                <ProgressBar value={100} label="Anita Raghavan utilisation" />
              </Td>
            </Tr>
            <Tr>
              <Td>Ingrid Solberg</Td>
              <Td>
                <StatusLozenge status="BENCH" />
              </Td>
              <Td>
                <ProgressBar value={0} label="Ingrid Solberg utilisation" />
              </Td>
            </Tr>
          </tbody>
        </Table>
      </Card>

      <Card title="Modal and toast">
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Open modal</Button>
          <Button onClick={() => toast('Allocation saved', 'success')}>
            Success toast
          </Button>
          <Button onClick={() => toast('This would exceed 100%', 'error')}>
            Error toast
          </Button>
        </div>
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Confirm allocation"
        footer={
          <>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <p>Allocate Anita Raghavan to Northwind core migration at 50%.</p>
      </Modal>
    </main>
  );
}
