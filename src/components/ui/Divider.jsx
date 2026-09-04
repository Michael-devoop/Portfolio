import AnimateInUp from './AnimateInUp';

export default function Divider({ image, alt = 'Divider Image', className = '' }) {
  return (
    <AnimateInUp className={`mb-block ${className}`}>
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden">
        <img
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    </AnimateInUp>
  );
}
