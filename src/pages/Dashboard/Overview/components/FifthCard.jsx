import { Card } from 'antd';
import {
  Axis,
  Chart,
  Geom,
  Legend,
  Tooltip as TooltipFromBizcharts,
} from 'bizcharts';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CardExtra from '../../components/CardExtra';
import * as actions from '../action';
import * as selectors from '../selector';

class FifthCard extends React.Component {
  onStatisticsClick = params => {
    const { departId, immediateCheck } = this.props;
    // 非初始化加载 && 没有选择事业部
    if (!immediateCheck && !departId) {
      message.error('请先选择事业部');
      return;
    }
    this.props.getCoverProjectCount({ ...params, departId });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.departId !== this.props.departId) {
      this.instance.fetchData();
    }
  }
  render() {
    const { coverProjectCount } = this.props;
    return (
      <Card
        title="覆盖规则趋势统计"
        extra={
          <CardExtra
            ref={instance => (this.instance = instance)}
            immediateCheck={this.props.immediateCheck}
            onStatisticsClick={this.onStatisticsClick}
          />
        }
        bordered={false}
        className="custom-card">
        {coverProjectCount.length ? (
          <Chart
            height={300}
            padding={[60, 80, 40, 40]}
            data={coverProjectCount}
            scale={{
              x: { min: coverProjectCount[0].x },
              y: { range: [0, 1], alias: '覆盖项目数量（个）' },
            }}
            forceFit>
            <Axis name="x" />
            <Axis name="y" />
            <TooltipFromBizcharts crosshairs={{ type: 'y' }} />
            <Legend name="x" position="top" />
            <Geom type="line" position="x*y" size={2} color="blue" />
          </Chart>
        ) : null}
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    coverProjectCount: selectors.getCoverProjectCountSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCoverProjectCount: bindActionCreators(
      actions.getCoverProjectCount,
      dispatch,
    ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FifthCard);
