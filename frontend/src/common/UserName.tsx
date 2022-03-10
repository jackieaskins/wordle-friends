import { User } from "wordle-friends-graphql";

type UserNameProps = {
  user: User | null | undefined;
  userId: string;
};

export default function UserName({ user, userId }: UserNameProps): JSX.Element {
  return <>{user ? `${user.firstName} ${user.lastName}` : userId}</>;
}
