import { Service } from "../../src";

@Service()
@Service(1)
export class TestService {
  TestValue: any = {};
}
