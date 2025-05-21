const ThreeControlButtons = ({
  onRedClicked,
}: {
  onRedClicked: () => void
}) => {
  return (
    <div className="flex gap-1">
      <div
        className="rounded-full w-3 h-3 bg-red-600 hover:cursor-pointer"
        onClick={onRedClicked}
      />
      <div className="rounded-full w-3 h-3 bg-yellow-600 hover:cursor-pointer" />
      <div className="rounded-full w-3 h-3 bg-green-600 hover:cursor-pointer" />
    </div>
  )
}

export default ThreeControlButtons
