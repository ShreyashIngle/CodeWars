class Prescription {
  constructor(data) {
    this.id = data.id;
    this.patientId = data.patientId;
    this.doctorId = data.doctorId;
    this.appointmentId = data.appointmentId;
    this.diagnosis = data.diagnosis;
    this.medicines = data.medicines.map(med => new Medicine(med));
    this.instructions = data.instructions;
    this.followUpDate = data.followUpDate ? new Date(data.followUpDate) : null;
    this.consultationFee = data.consultationFee;
    this.paymentStatus = data.paymentStatus;
    this.pdfUrl = data.pdfUrl;
    this.createdAt = new Date(data.createdAt);
  }

  formatFollowUpDate() {
    if (!this.followUpDate) return 'No follow-up scheduled';
    return this.followUpDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatCreatedDate() {
    return this.createdAt.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  isPaid() {
    return this.paymentStatus === 'completed';
  }
}

class Medicine {
  constructor(data) {
    this.name = data.name;
    this.dosage = data.dosage;
    this.duration = data.duration;
    this.timing = data.timing;
  }

  getFullInstructions() {
    return `${this.name} - ${this.dosage} ${this.timing} for ${this.duration}`;
  }
}

export default Prescription;