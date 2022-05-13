import { useThrottleCallback } from "@react-hook/throttle";
import clsx from "clsx";
import type { NextPage } from "next";
import * as React from "react";
import { useQuery } from "react-query";

import { getRandomNumber, isWithinRange } from "../lib";

const Home: NextPage = () => {
  const [value, setValue] = React.useState(1);
  const [currentColor, setCurrentColor] = React.useState<
    "green" | "red" | "blue" | string
  >("");
  const [colorList, setColorList] = React.useState<string[]>([]);
  const buttonClass = clsx({
    "bg-green-400": currentColor === "green",
    "bg-red-400": currentColor === "red",
    "bg-blue-400": currentColor === "blue",
    "btn btn-primary": true,
  });
  // react query refetch automatically when the query key changed, we are utilizing it here to throttle the refetch
  const { data } = useQuery([value], getRandomNumber, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    onSuccess: (data) => {
      // if the number is odd reset the color of the button according to range logic, else
      // call the api again
      if (data % 2 === 1) {
        if (isWithinRange(data, [1, 300])) {
          setCurrentColor("green");
        } else if (isWithinRange(data, [300, 600])) {
          setCurrentColor("red");
        } else if (isWithinRange(data, [600, 900])) {
          setCurrentColor("blue");
        }
      } else if (data % 2 === 0) {
        delayedRefetch();
      }
    },
  });

  const refetch = () => {
    setValue((prev) => prev + 1);
  };

  const delayedRefetch = useThrottleCallback(refetch, 30 / value);

  const handleSetColorList = (val: string) => {
    // if the initial color is empty, directly set the color to the list
    // else if there is a color concat the array
    if (currentColor === "") {
      setColorList([val]);
    } else {
      setColorList([...colorList, val]);
    }
  };

  const handleClick = () => {
    // store the current color of the button to the colorList, refetch the data
    handleSetColorList(currentColor);
    delayedRefetch();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto grid place-content-center min-h-screen h-full">
        <main className="h-full">
          <button className={buttonClass} type="button" onClick={handleClick}>
            Hello
          </button>
          {/* A list of colors */}
          <div className="mt-4">
            <ul className="list-disc">
              {colorList.map((color, index) => (
                <li key={index} className="text-gray-700">
                  {color}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
