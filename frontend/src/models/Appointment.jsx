class Appointment {
  constructor(data) {
    this.id = data.id;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.appointmentDate = new Date(data.appointmentDate);
    this.status = data.status;
    this.symptoms = data.symptoms;
    this.type = data.type;
    this.notes = data.notes;
    this.cancelReason = data.cancelReason;
  }

  static getStatusColor(status) {
    const colors = {
      pending: 'yellow',
      confirmed: 'blue',
      cancelled: 'red',
      completed: 'blue',
      emergency: 'red'
    };
    return colors[status] || 'gray';
  }

  static getStatusText(status) {
    const text = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      emergency: 'Emergency'
    };
    return text[status] || status;
  }

  isUpcoming() {
    return this.appointmentDate > new Date();
  }

  isPending() {
    return this.status === 'pending';
  }

  isEmergency() {
    return this.type === 'emergency';
  }

  formatAppointmentDate() {
    return this.appointmentDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

export default Appointment;