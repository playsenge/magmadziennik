import { useState } from "react";
import { Button } from "../components/ui/button";
import { AiFillDiscord } from "react-icons/ai";

export default function MainPage() {
  const [counter, setCounter] = useState(0);

  return (
    <h1>
      Hello World! {counter}
      <AiFillDiscord className="text-9xl" />
      <Button
        className="mt-4 flex items-center justify-center pb-4"
        onClick={() => {
          alert("hi!");
          setCounter(counter + 1);
        }}
      >
        Test
      </Button>
    </h1>
  );
}
