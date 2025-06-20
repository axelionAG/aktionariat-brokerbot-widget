import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneCheckbox,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { escape } from "@microsoft/sp-lodash-subset";

import styles from "./AktionariatBrokerbotWidgetWebPart.module.scss";
import * as strings from "AktionariatBrokerbotWidgetWebPartStrings";

export interface IAktionariatBrokerbotWidgetWebPartProps {
  ticker: string;
  showBrokerbot: boolean;
  showChart: boolean;
  showProgress: boolean;
  showInvestorGroupsChart: boolean;
}

export default class AktionariatBrokerbotWidgetWebPart extends BaseClientSideWebPart<IAktionariatBrokerbotWidgetWebPartProps> {
  public async render(): Promise<void> {
    await import(
      /* webpackIgnore: true, webpackChunkName: 'brokerbot-v3' */ "https://hub.aktionariat.com/brokerbot-v3/brokerbot-v3.mjs"
    );

    await import(
      /* webpackIgnore: true, webpackChunkName: 'shareholder-registration-v2' */ "https://hub.aktionariat.com/widgets/shareholder-registration-v2.mjs"
    );

    await import(
      /* webpackIgnore: true, webpackChunkName: 'shareholder-registration-v2' */ "https://hub.aktionariat.com/widgets/widgets-ext.mjs"
    );

    const ticker = escape(this.properties.ticker);

    let brokerbotHtml = `
        <div style="margin-top: 24px;">
          <akt-brokerbot ticker="${ticker}" lang="en" id="brokerbot"></akt-brokerbot>
        </div>`

    let chartHtml = `
        <div style="margin-top: 128px;">
          <akt-chart ticker="${ticker}"></akt-chart>
        </div> `;

    let progressHtml = `
        <div style="margin-top: 128px;">
          <akt-progress ticker="${ticker}" showLiquidityPool></akt-progress>
        </div>`;

    let investorGroupsChartHtml = `
        <div style="margin-top: 128px;">
          <akt-investor-groups-chart 
            ticker="${ticker}" 
            colors='["#a8b4bb","#dfe6ec","#9051e4","#4ccd4f"]'
            showTitle 
            showDataLabels>
          </akt-investor-groups-chart>
        </div>`;

    let html = `
      <section class="${styles.aktionariatBrokerbotWidget}">`;

    if (this.properties.showBrokerbot) {
      html += brokerbotHtml;
    }
    if (this.properties.showChart) {
      html += chartHtml;
    }
    if (this.properties.showProgress) {
      html += progressHtml;
    }
    if (this.properties.showInvestorGroupsChart) {
      html += investorGroupsChartHtml;
    }
    html += `
      </section>`;

    this.domElement.innerHTML = html;

  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("ticker", {
                  label: strings.TickerFieldLabel,
                }),
                PropertyPaneCheckbox("showBrokerbot", {
                  text: strings.ShowBrokerbotFieldLabel
                }),
                PropertyPaneCheckbox("showChart", {
                  text: strings.ShowChartFieldLabel
                }),
                PropertyPaneCheckbox("showProgress", {
                  text: strings.ShowProgressFieldLabel
                }),
                PropertyPaneCheckbox("showInvestorGroupsChart", {
                  text: strings.ShowInvestorGroupsChartFieldLabel
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
