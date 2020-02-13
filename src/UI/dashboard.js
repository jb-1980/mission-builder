import React from "react"
import { css } from "emotion"
import { Link, Router, navigate } from "@reach/router"
import Modal from "react-modal"
import { Navbar } from "./navbar"
import { Mission, CreateMission, CloneMission } from "./mission"
import { Loading } from "./loading"
import { Error } from "./error"
import { useUser } from "../contexts/user-context"
import { useMissions } from "../apollo/queries"
import { colors } from "./colors"
import { btnPrimaryOutline, btnPrimary } from "./btn-css"

const inverseBtnPrimaryOutline = css`
  ${btnPrimaryOutline};
  border: 2.25px solid ${colors.lightFont};
  color: ${colors.lightFont};
  background: ${colors.primary};
  text-decoration: none;
  margin: 10px;
  &:hover {
    color: ${colors.primary};
    background: ${colors.lightFont};
  }
`
export const Dashboard = props => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)
  const [cloneModalOpen, setCloneModalOpen] = React.useState(false)

  const { user } = useUser()
  const { data, error, loading, refetch } = useMissions({
    variables: { kaid: user.kaid },
  })

  if (error) return <Error message="Error loading missions." />
  if (loading) return <Loading message="Loading missions from server" />

  const { missions } = data
  return (
    <>
      <div className="app" {...props}>
        <div
          className={css`
            min-height: 100vh;
            z-index: 1981;
            background-color: ${colors.primary};
            overflow: hidden;
            width: ${sidebarOpen ? "400px" : "0px"};
            transition: all 0.5s;
          `}
        >
          <div
            className={css`
              width: 400px;
              opacity: ${sidebarOpen ? 100 : 0};
              transition: opacity 1.5s;
              overflow: hidden;
              position: ${sidebarOpen ? "fixed" : "relative"};
            `}
          >
            <div
              className={css`
                width: 100%;
                display: flex;
                justify-content: center;
              `}
            >
              <Link className={inverseBtnPrimaryOutline} to="/mission/create">
                Create mission
              </Link>
              <button
                className={inverseBtnPrimaryOutline}
                onClick={() => setCloneModalOpen(true)}
              >
                Clone Mission
              </button>
            </div>
            {missions.map(m => (
              <div
                key={m.code}
                className={css`
                  padding: 3px 20px;
                  display: block;
                  text-decoration: none;
                  color: ${colors.lightFont};
                  margin: 5px 10px;
                  font-size: 23px;
                  white-space: nowrap;
                  cursor: pointer;
                  &:hover {
                    background: ${colors.lightFont};
                    color: ${colors.primary};
                  }
                `}
                onClick={() => {
                  setSidebarOpen(false)
                  navigate(`/mission/${m.code}`)
                }}
              >
                {m.title}
              </div>
            ))}
          </div>
        </div>
        <div
          className={css`
            position: relative;
            width: ${sidebarOpen ? "calc(100% - 400px)" : "100%"};
            transition: width 0.5s;
          `}
        >
          <Navbar
            menuOpen={sidebarOpen}
            setMenuOpen={() => setSidebarOpen(!sidebarOpen)}
          />
          {cloneModalOpen && (
            <CloneModal
              isOpen={true}
              onRequestClose={() => setCloneModalOpen(false)}
            />
          )}
          <div style={{ marginTop: 40 }}>
            <Router>
              <Home default editMissionHandler={setSidebarOpen} />
              <CreateMission path="/mission/create" refetch={refetch} />
              <CloneMission path="/mission/clone/:missionCode" />
              <Mission path="/mission/:missionCode" />
            </Router>
          </div>
        </div>
      </div>
    </>
  )
}

const btn = css`
  ${btnPrimaryOutline};
  box-sizing: border-box;
  width: 150px;
  margin: 5px 0;
  text-decoration: none;
`

const Home = ({ editMissionHandler }) => (
  <div
    className={css`
      width: 100%;
      height: calc(100vh - 40px);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #fff;
    `}
  >
    <h1>Mission Control</h1>
    <button className={btn} onClick={() => editMissionHandler(true)}>
      Edit a mission
    </button>
    <button className={btn}>Clone a mission</button>
    <Link
      className={btn}
      style={{ textDecoration: "none", width: 150 }}
      to="/mission/create"
    >
      Create a mission
    </Link>
  </div>
)

const CloneModal = props => {
  const [code, setCode] = React.useState("")

  return (
    <Modal
      {...props}
      style={{
        overlay: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        content: {
          width: 400,
          height: 200,
          position: "relative",
        },
      }}
    >
      <div
        className={css`
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          box-sizing: border-box;
        `}
      >
        <input
          className={css`
            transition: all 0.3s ease-in-out;
            outline: none;
            padding: 3px 0px 3px 3px;
            margin: 5px 1px 3px 0px;
            border: 1px solid ${colors.primary};
            width: 100%;
            height: 30px;

            text-align: center;
            font-size: 20px;
            color: ${colors.primary}AA;
            font-weight: bold;
            &:focus {
              box-shadow: 0 0 5px ${colors.primary};
              padding: 3px 0px 3px 3px;
              margin: 5px 1px 3px 0px;
              border: 1px solid ${colors.primary};
            }
          `}
          type="text"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <div
          className={css`
            font-size: 20px;
            color: #565656;
            margin: 5px 0;
          `}
        >
          Enter the mission code you wish to clone
        </div>
        <div>
          <button
            style={{ marginRight: 3 }}
            className={btnPrimary}
            onClick={() => {
              props.onRequestClose()
              navigate(`/mission/clone/${code}`)
            }}
          >
            Clone
          </button>
          <button
            style={{ marginLeft: 3, background: colors.practiced }}
            className={btnPrimary}
            onClick={props.onRequestClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  )
}
