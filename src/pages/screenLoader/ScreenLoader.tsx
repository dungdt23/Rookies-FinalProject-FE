import { FC } from 'react'
import classes from './ScreenLoader.module.scss'
const ScreenLoader: FC = () => {
    return (
        <div className={classes['loader-container']}>
            <div className={classes['loader-img']}>
                <img
                    src={`/images/logo.png`}
                    alt="Logo"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    )
}

export default ScreenLoader