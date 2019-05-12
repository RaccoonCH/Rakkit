import { Service } from "../../../..";

@Service()
@Service(1)
export class TestService {
  TestValue: any = {};
}
