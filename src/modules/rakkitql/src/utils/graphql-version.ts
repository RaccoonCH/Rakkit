import * as semVer from "semver";

import { UnmetGraphQLPeerDependencyError } from "../errors";

export function getInstalledGraphQLVersion(): string {
  const graphqlPackageJson = require("graphql/package.json");
  return graphqlPackageJson.version;
}

export function getPeerDependencyGraphQLRequirement(): string {
  const ownPackageJson = require("../../../../../package.json");
  try {
    return ownPackageJson.peerDependencies.graphql;
  } catch (err) {
    return "";
  }
}

export function ensureInstalledCorrectGraphQLPackage() {
  const installedVersion = getInstalledGraphQLVersion();
  const versionRequirement = getPeerDependencyGraphQLRequirement();

  if (!semVer.satisfies(installedVersion, versionRequirement)) {
    throw new UnmetGraphQLPeerDependencyError();
  }
}
