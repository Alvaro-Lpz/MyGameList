import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GameList from './GameList';

export default function Dashboard({ auth }) {
  return (
    <AuthenticatedLayout user={auth.user}>
      <GameList />
    </AuthenticatedLayout>
  );
}