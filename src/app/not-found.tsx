import NotFoundImage from "@/public/images/bsod.png"
import { Button } from "@heroui/button"
import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center">
        <div className="flex justify-center mt-12">
          <Image
            src={NotFoundImage}
            alt="not-found-image"
            className="w-full h-full"
          />
        </div>

        <div className="flex justify-center absolute">
          <Link href="/">
            <Button color="primary">Go to homepage</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
