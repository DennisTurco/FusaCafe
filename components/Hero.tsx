interface HeroProps {
    imagePath: string;
    title: string;
}

const Hero = ({imagePath, title}: HeroProps) => {
    return (
        <section
            className="relative w-full h-96 bg-cover bg-center"
            style={{
                backgroundImage: "url(" + imagePath + ")"
            }}
            >
            <div className="absolute inset-0 bg-black opacity-40"></div>
            <div className="absolute inset-0 flex justify-center items-center text-center text-white">
                <h1 className="text-5xl font-extrabold">{title}</h1>
            </div> 
        </section>
    );
};

export default Hero;