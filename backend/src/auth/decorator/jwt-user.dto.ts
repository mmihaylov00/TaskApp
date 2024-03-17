import { Role } from 'taskapp-common/dist/src/enums/role.enum';
import { Project } from '../../database/entity/project.entity';

export class JwtUser {
  id: string;
  email: string;
  role: Role;

  constructor(payload: { id: string; email: string; role: Role }) {
    this.id = payload.id;
    this.email = payload.email;
    this.role = payload.role;
  }

  public isPartOfProject(project: Project) {
    return project.users?.some((u) => (u.id = this.id));
  }
}
