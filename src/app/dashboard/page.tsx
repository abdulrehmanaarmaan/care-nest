import { redirect } from 'next/navigation';
import React from 'react';

const DashboardHome = () => {
    redirect('/dashboard/my-bookings')
};

export default DashboardHome;