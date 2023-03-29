import React from 'react';

import Navbar from '../../components/global-components/navbar';
import PageHeader from '../../components/global-components/header';
import Appointments from '../../components/customer-components/appointments';
import CallToActionV1 from '../../components/section-components/call-to-action-v1';
import Footer from '../../components/global-components/footer';

function CustomerAppointmentsPage() {
  return (
    <div>
      <Navbar />
      <PageHeader headertitle="Appointments" />
      <Appointments />
      <CallToActionV1 />
      <Footer />
    </div>
  );
}

export default CustomerAppointmentsPage;