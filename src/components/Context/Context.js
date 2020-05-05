import React, { Component } from 'react'
import { placeInfo, reviews, detailInfo, news } from '../../constants/data'
const InfoContext = React.createContext();

//provider
//consumer

class InfoProvider extends Component {

    state = {
        info: placeInfo,
        reviews: reviews,
        detailInfo: detailInfo,
        news: news
    }
    render() {
        return (
            <InfoContext.Provider value={{
                info: this.state.info,
                reviews: this.state.reviews,
                detailInfo: this.state.detailInfo,
                news: this.state.news
            }}>
                {this.props.children}
            </InfoContext.Provider>
        )
    }
}

const InfoConsumer = InfoContext.Consumer;

export { InfoProvider, InfoConsumer };