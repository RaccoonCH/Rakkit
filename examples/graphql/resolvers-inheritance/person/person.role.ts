import { TypeCreator } from "../../../../src";

export enum PersonRole {
  Normal,
  Pro,
  Admin
}

TypeCreator.CreateEnum(PersonRole, { name: "PersonRole" });
