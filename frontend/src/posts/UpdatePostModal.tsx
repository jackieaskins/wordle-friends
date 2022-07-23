import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { FormEventHandler, useCallback, useMemo, useState } from "react";
import { SimplePost, useUpdatePost } from "./api";
import EnterGuessesFormFields from "./EnterGuessesFormFields";

type UpdatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  post: SimplePost;
};

export default function UpdatePostModal({
  isOpen,
  onClose,
  post,
}: UpdatePostModalProps): JSX.Element {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const { colors } = post;
  const { mutate: updatePost, isLoading } = useUpdatePost();

  const [initGuesses] = useState(post.guesses ?? colors.map(() => ""));
  const guessesState = useState<string[]>(initGuesses);
  const [guesses] = guessesState;

  const [initMessage] = useState(post.message ?? "");
  const messageState = useState<string>(initMessage);
  const [message] = messageState;

  const handleSubmit: FormEventHandler<HTMLElement> = useCallback(
    (event) => {
      event.preventDefault();

      const { user, __typename, ...rest } = post;

      updatePost(
        { input: { ...rest, guesses, message } },
        { onSuccess: onClose }
      );
    },
    [guesses, message, onClose, post, updatePost]
  );

  const hasEdited = useMemo(
    () =>
      message !== initMessage ||
      initGuesses?.some((guess, index) => guess !== guesses[index]),
    [guesses, initGuesses, initMessage, message]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />

      <ModalContent as="form" bg={bgColor} onSubmit={handleSubmit}>
        <ModalHeader>Update post</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <EnterGuessesFormFields
            colors={colors}
            guessesState={guessesState}
            messageState={messageState}
          />
        </ModalBody>

        <ModalFooter>
          <Button type="button" mr={3} onClick={onClose} variant="ghost">
            Close
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            isDisabled={
              !hasEdited || guesses.some((guess) => guess.length !== 5)
            }
          >
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
