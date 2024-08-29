import { Button } from "../components/ui/button";

export default function MainPage() {
  return (
    <h1>
      Hello World!
      <Button
        className="mt-4 flex items-center justify-center pb-4"
        onClick={() => {
          alert("hi!");
        }}
      >
        Test
      </Button>
    </h1>
  );
}
