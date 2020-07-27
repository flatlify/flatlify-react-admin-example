/* eslint-disable max-classes-per-file */
export class DeleteError extends Error {
  constructor(id) {
    super('Cannot delete Content Type');
    this.id = id;
  }
}

export class UpdateError extends Error {
  constructor(id) {
    super('Cannot update Content Type');
    this.id = id;
  }
}
