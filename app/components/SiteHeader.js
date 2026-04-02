//on every page except log in- wrap in root layout ?
//search, dashboard (does not need to have a page atp), reports (does not need to have a page)
//user profile in top right- will need dropdown on hover/click - for manage archive option
import Link from "next/link";
import Image from "next/image";

export default function SiteHeader() {
  return (
    <nav className="flex flex-row justify-between text-lg mt-5 mb-15 border-b border-gray-300 pb-5">
      <div className="flex justify-start ml-10">
        <div className="flex flex-row items-end">
          <Image
            src="/assets/Logo.png"
            alt="Calgary Opera logo"
            width={100}
            height={100}
            style={{ backgroundColor: "white" }}
          />
          <div className="font-bold">ARCHIVE</div>
        </div>
      </div>
      <div className="flex h-5 justify-center items-center gap-4">
        <Link href="#" className="hover:scale-110">
          SEARCH
        </Link>

        <Link href="#" className="hover:scale-110">
          DASHBOARD
        </Link>
        <Link href="#" className="hover:scale-110">
          REPORTS
        </Link>
      </div>
      <div className="mr-10">PROFILE</div>
    </nav>
  );
}
