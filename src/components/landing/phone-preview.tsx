import Image from "next/image";

export function PhonePreview() {
  return (
    <div className="mx-auto w-full max-w-sm lg:max-w-md" aria-label="Náhled mobilní aplikace Studánky">
      <div className="rounded-[2rem] bg-stone p-2 shadow-xl shadow-primary/10">
        <div className="overflow-hidden rounded-[1.5rem] bg-card ring-1 ring-border">
          <Image
            src="/app/screenshot-map.svg"
            alt="Ukázka mapy v mobilní aplikaci Studánky"
            width={420}
            height={746}
            priority
            className="h-auto w-full"
          />
        </div>
      </div>
    </div>
  );
}
