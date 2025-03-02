declare global {
  interface CreateTreatmentPlanParams {
    title: string;
    suitable: string[];
    description: string;
    outcomes: string;
    sessions: string[];
  }

  interface GetTreatmentPlanParams {
    title: string;
  }
}

export {};
