export const buildStartDate = (startDate: string) => {
  const d = new Date(`${startDate}T00:00:00.000Z`);
  return d.toISOString().slice(0, 10);
};

export const buildEndDate = (endDate: string) => {
  const d = new Date(`${endDate}T23:59:59.000Z`);
  return d.toISOString().slice(0, 10);
};
