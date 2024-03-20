export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export const TASK_PRIORITIES = [
  TaskPriority.LOW,
  TaskPriority.MEDIUM,
  TaskPriority.HIGH,
];
export const TASK_PRIORITY_COLORS = {
  [TaskPriority.LOW]: '#a56ea3',
  [TaskPriority.MEDIUM]: '#833ab4',
  [TaskPriority.HIGH]: '#bb2124',
};
