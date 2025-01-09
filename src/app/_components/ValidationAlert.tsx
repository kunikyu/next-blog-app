import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
type Props = {
  msg: string;
};
const ValidationAlert: React.FC<Props> = (props) => {
  return (
    props.msg && (
      <div className="text-red-400">
        <FontAwesomeIcon icon={faCircleExclamation} />
        {props.msg}
      </div>
    )
  );
};

export default ValidationAlert;
