import prisma from ".";

export interface UserType {
  id: string;
  email: string;
  username: string;
  passwordsMatch: (passwordHash: string) => boolean;
}

export interface RepoType {
  id: string;
  name: string;
  userId: string;
}

export enum ReturnStatus {
  Success = "Success",
  AlreadyExist = "AlreadyExist",
  NotFound = "NotFound",
  PrismaError = "PrismaError",
}

export interface UserResponse {
  user: UserType | undefined;
  status: ReturnStatus;
}

export interface RepoResponse {
  repos: RepoType[] | undefined;
  status: ReturnStatus;
}

export const createUserHandler = async (email: string, username: string, passwordHash: string): Promise<UserResponse> => {
  const userByUsername = await getUserByUsername(username);
  const userByEmail = await getUserByEmail(email);
  if (userByUsername.user || userByEmail.user) {
    return { user: undefined, status: ReturnStatus.AlreadyExist };
  }

  let createdUser: { id: string; email: string; username: string; passwordHash: string };
  try {
    createdUser = await prisma.user.create({
      data: {
        email: email,
        username: username,
        passwordHash: passwordHash,
      },
    });
  } catch (err) {
    console.log(err);
    return { user: undefined, status: ReturnStatus.PrismaError };
  }

  return {
    user: {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      passwordsMatch: (passwordHash: string) => createdUser.passwordHash === passwordHash,
    },
    status: ReturnStatus.Success,
  };
};

export const getUserByID = async (targetID: string): Promise<UserResponse> => {
  let user: { id: string; email: string; username: string; passwordHash: string } | null;
  try {
    user = await prisma.user.findUnique({
      where: { id: targetID },
    });
  } catch (err) {
    return { user: undefined, status: ReturnStatus.PrismaError };
  }

  if (!user) return { user: undefined, status: ReturnStatus.NotFound };

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordsMatch: (passwordHash: string) => user.passwordHash === passwordHash,
    },
    status: ReturnStatus.Success,
  };
};

export const getUserByEmail = async (targetEmail: string): Promise<UserResponse> => {
  let user: { id: string; email: string; username: string; passwordHash: string } | null;
  try {
    user = await prisma.user.findUnique({
      where: { email: targetEmail },
    });
  } catch (err) {
    return { user: undefined, status: ReturnStatus.PrismaError };
  }

  if (!user) return { user: undefined, status: ReturnStatus.NotFound };

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordsMatch: (passwordHash: string) => user.passwordHash === passwordHash,
    },
    status: ReturnStatus.Success,
  };
};

export const getUserByUsername = async (targetUsername: string): Promise<UserResponse> => {
  let user: { id: string; email: string; username: string; passwordHash: string } | null;
  try {
    user = await prisma.user.findUnique({
      where: { username: targetUsername },
    });
  } catch (err) {
    return { user: undefined, status: ReturnStatus.PrismaError };
  }

  if (!user) return { user: undefined, status: ReturnStatus.NotFound };

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordsMatch: (passwordHash: string) => user.passwordHash === passwordHash,
    },
    status: ReturnStatus.Success,
  };
};

export const getUserReposByUsername = async (targetUsername: string): Promise<RepoResponse> => {
  let repos: { repositories: RepoType[] } | null;
  try {
    repos = await prisma.user.findUnique({
      where: { username: targetUsername },
      select: { repositories: true },
    });
  } catch (err) {
    return { repos: undefined, status: ReturnStatus.PrismaError };
  }

  if (!repos) return { repos: undefined, status: ReturnStatus.NotFound };
  return { repos: repos.repositories, status: ReturnStatus.Success };
};

export const deleteUserHandler = async (targetUsername: string): Promise<{ status: ReturnStatus }> => {
  const user = await getUserByUsername(targetUsername);
  if (!user.user) return { status: ReturnStatus.NotFound };

  try {
    await prisma.user.delete({
      where: { id: user.user.id },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  } catch (err) {
    return { status: ReturnStatus.PrismaError };
  }

  return { status: ReturnStatus.Success };
};
