const USERS_KEY = "innap_demo_users";

const defaultUser = {
  username: "demo",
  fullName: "Demo User",
  orgName: "Innap Cooperative Bank",
  email: "demo@innap.com",
  password: "Demo@123",
};

const readUsers = () => {
  if (typeof window === "undefined") return [defaultUser];
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    const hasDefault = parsed.some(
      (user) => user.email?.toLowerCase() === defaultUser.email,
    );
    return hasDefault ? parsed : [defaultUser, ...parsed];
  } catch {
    return [defaultUser];
  }
};

const writeUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const demoLogin = async (bodyData) => {
  const email = String(bodyData.email || "").trim().toLowerCase();
  const password = String(bodyData.password || "");
  const user = readUsers().find(
    (item) => item.email?.toLowerCase() === email && item.password === password,
  );

  if (!user) {
    return { message: "Invalid email or password" };
  }

  return {
    message: "Success",
    details: {
      token: `demo-${user.email}`,
      userName: user.username || user.fullName,
      userOrgName: user.orgName || "Innap Cooperative Bank",
      orgId: "1",
      userBranchId: "1",
      finId: "1",
    },
  };
};

export const demoSignup = async (bodyData) => {
  const email = String(bodyData.email || "").trim().toLowerCase();
  const username = String(bodyData.username || "").trim();
  const users = readUsers();

  if (users.some((item) => item.email?.toLowerCase() === email)) {
    return { message: "Email already registered" };
  }

  if (
    users.some(
      (item) =>
        String(item.username || "").toLowerCase() === username.toLowerCase(),
    )
  ) {
    return { message: "Username already taken" };
  }

  const nextUser = {
    username,
    fullName: username,
    orgName: "Innap Cooperative Bank",
    email,
    password: bodyData.password,
  };
  writeUsers([...users, nextUser]);

  return {
    message: "Success",
    details: {
      token: `demo-${email}`,
      userName: nextUser.username,
      userOrgName: nextUser.orgName,
      orgId: "1",
      userBranchId: "1",
      finId: "1",
    },
  };
};
