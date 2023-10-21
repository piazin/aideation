'use client';
import React from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {};

const CreateNoteDialog = (props: Props) => {
  const router = useRouter();
  const [input, setInput] = React.useState('');
  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post('/api/uploadToFirebase', {
        noteId,
      });
      return response.data;
    },
  });

  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post('/api/createNoteBook', {
        name: input,
      });
      return response.data;
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === '') {
      window.alert('Please enter a name for your notebook');
      return;
    }

    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log({ note_id });
        uploadToFirebase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (err) => {
        console.error(err);
        window.alert('Failed to create new notebook');
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">Novo caderno</h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar um novo caderno</DialogTitle>
          <DialogDescription>
            Você pode criar uma nova nota clicando no botão abaixo.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input placeholder="Nome..." value={input} onChange={(e) => setInput(e.target.value)} />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <DialogClose>
              <Button type="reset" variant="secondary">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" className="bg-green-600" disabled={createNotebook.isLoading}>
              {createNotebook.isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Criar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
