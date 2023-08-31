interface ColorViewProps {
  hex: string;
}

const ColorView: React.FC<ColorViewProps> = ({ hex }) => {
  return (
    <div className="flex items-center gap-x-2">
      <div
        className="p-2 rounded-full border"
        style={{ backgroundColor: hex }}
      />
      {hex}
    </div>
  );
};

export default ColorView;
