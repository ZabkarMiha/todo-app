import Image from "next/image";

export default function AppLogo() {
    const images = [
        { src: "/images/todo-app-logo-dark-mode.png", className: "hidden dark:block" },
        { src: "/images/todo-app-logo-light-mode.png", className: "mb-4 block dark:hidden" },
    ];

    return (
        <div>
            {images.map((image, index) => (
                <Image
                    key={index}
                    className={image.className}
                    src={image.src}
                    alt={`${index === 0 ? "dark" : "light"}-mode-image`}
                    width={144}
                    height={144}
                    priority={true}
                />
            ))}
        </div>
    );
}