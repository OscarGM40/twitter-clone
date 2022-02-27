interface Props {
  trendingResults: any
  followResults: any
}
const Widgets = (props: Props) => {
  console.log(props,'widgets')
  return (
    <div>Widgets</div>
  )
}
export default Widgets