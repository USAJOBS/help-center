<?php
/**
 * Modification of the MonoBook nouveau skin.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @file
 * @ingroup Skins
 */

/**
 * @ingroup Skins
 */
class USAJOBSTemplate extends BaseTemplate {

	/**
	 * Template filter callback for USAJOBS skin.
	 * Takes an associative array of data set from a SkinTemplate-based
	 * class, and a wrapper for MediaWiki's localization database, and
	 * outputs a formatted page.
	 *
	 * @access private
	 */
	function execute() {
		// Suppress warnings to prevent notices about missing indexes in $this->data
		wfSuppressWarnings();

		$this->html( 'headelement' );
		?><div class="usajobs-canvas usajobs-help-center">
				<a class="skipnav" href="#main-content">Skip to main content</a>
			  <header class="usajobs-site-header" role="banner" aria-label="header">
			    <div class="usa-disclaimer">
			      <span class="usajobs-disclaimer-official">
			        <img class="usa-flag_icon" alt="U.S. flag signifying that this is a United States federal government website" src="skins/USAJOBS/images/us_flag_small.png">
			        An official website of the United States Government
			      </span>
			    </div>
			    <nav class="usajobs-nav--v2" role="navigation" aria-label="main navigation" data-object="nav">
			      <div class="usajobs-nav--v2__body">
			        <div class="usajobs-nav--v2__header-container">
			          <div class="usajobs-nav--v2__header">
			            <div class="usajobs-nav--v2__brand-container">
			              <a class="usajobs-nav--v2__brand" href="/">
			                <img src="skins/USAJOBS/images/USAJOBS_logo.png" alt="USAJOBS Logo" class="logo">
			              </a>
			            </div>
			            <div class="usajobs-nav--v2__menu" id="usajobs-menu">
			              <ul>
			                <li class="usajobs-nav--v2__menu-container usajobs-nav--v2__account" data-state="is-closed">
			                  <a class="usajobs-nav--v2__section-link menu-toggle" data-behavior="nav.menu.toggle" aria-haspopup="true" href="#account" title="Account">
			                    <span class="fa fa-user"></span>
			                    <span class="usajobs-nav--v2__account_name">QQ</span>
			                    <span class="usajobs-nav--v2__first_name">Quadrina</span>
			                  </a>
			                  <ul class="usajobs-nav--v2__secondary-menu" aria-expanded="false" role="menu">
			                    <li><a href="/Applicant/MyAccount/Home">Home</a></li>
			                    <li><a href="/Applicant/MyAccount/Profile">Profile</a></li>
			                    <li><a href="/Applicant/MyAccount/Documents">Documents</a></li>
			                    <li><a href="/Applicant/MyAccount/Account">Username &amp; Password</a></li>
			                    <li><a href="/Applicant/Profile/">Sign Out</a></li>
			                  </ul>
			                </li>
			                <li class="usajobs-nav--v2__menu-container usajobs-nav--v2__help">
			                  <a class="usajobs-nav--v2__section-link" href="http://help.sqa.usajobs.gov/index.php/Main_Page" title="Help">
			                    <span class="fa fa-question-circle"></span>
			                    Help
			                  </a>
			                </li>
			                <li class="usajobs-nav--v2__menu-container usajobs-nav--v2__menu-search" data-state="is-closed" data-target="#usajobs-search-form-v2-alt">
			                  <a data-behavior="nav.menu.search-toggle" aria-haspopup="true" class="usajobs-nav--v2__section-link" href="/" title="Job Search">
			                    <span class="fa fa-search"></span>
			                    Search
			                  </a>
			                </li>
			              </ul>
			            </div>
			          </div>
			          <div id="usajobs-search-form-v2-alt" class="usajobs-nav--v2__search" aria-expanded="false" role="menu">
			            <form action="/Search" method="get" novalidate="novalidate" role="search">
			              <fieldset>
			                <div class="usajobs-nav--v2__search-keywords-container">
			                  <label for="search-keyword-v2-alt">
			                    <i class="usajobs-nav--v2__search-keywords-icon fa fa-search"></i>
			                    Keywords
			                  </label>
			                  <input id="search-keyword-v2-alt" name="search-keyword" class="usajobs-nav--v2__search-keywords-input" placeholder="Job title, Skills, Agency" type="text" value="" autocomplete="false">
			                </div>
			                <div class="usajobs-nav--v2__search-location-container">
			                  <label for="search-location-v2-alt">
			                    <i class="usajobs-nav--v2__search-location-icon fa fa-map-marker"></i>
			                    Location
			                  </label>
			                  <input id="search-location-v2-alt" name="search-location" type="text" class="usajobs-nav--v2__search-location-input" placeholder="City, State, ZIP, or Country">
			                </div>
			                <div class="usajobs-nav--v2__search-button-container">
			                  <button class="usa-button usa-button-primary-alt usajobs-nav--v2__search-button">
			                    Search
			                  </button>
			                </div>
			              </fieldset>
			            </form>
			          </div>
			        </div>
			      </div>
			    </nav>
			  </header>
			  <section class="usajobs-help-center-search" role="search" aria-label="search">
			  	<h1 class="usajobs-help-center-search__title">Help Center</h1>
					<?php $this->searchBox(); ?>
			  </section>

				<main class="usajobs-content" id="main-content" role="main">
					<a id="top"></a>
				<?php
				if ( $this->data['sitenotice'] ) {
					?>
					<div id="siteNotice" class="usa-alert usajobs-alert usajobs-alert--info" role="alert">
						<div class="usajobs-alert__figure">
      				<div class="usajobs-alert__icon"></div>
    				</div>
    				<div class="usajobs-alert__body">
      				<p class="usa-alert-text"><?php $this->html( 'sitenotice' ) ?></p>
      			</div>
      		</div><?php
				}
				?>
				<div class="usajobs-grid">
					<section class="usajobs-content-well">
						<div class="content-sub"<?php
						$this->html( 'userlangattributes' ) ?>><?php $this->html( 'subtitle' )
							?></div>
						<?php if ( $this->data['undelete'] ) { ?>
							<div id="contentSub2"><?php $this->html( 'undelete' ) ?></div>
						<?php
						}
						?><?php
						if ( $this->data['newtalk'] ) {
							?>
							<div class="user-message"><?php $this->html( 'newtalk' ) ?></div>
						<?php
						}
						?>

					<?php
					// Loose comparison with '!=' is intentional, to catch null and false too, but not '0'
					if ( $this->data['title'] != '' ) {
					?>
						<h1><?php $this->html( 'title' ) ?></h1>
					<?php } ?>


					<!-- start content -->
					<?php $this->html( 'bodytext' ) ?>
					<?php
					if ( $this->data['catlinks'] ) {
						$this->html( 'catlinks' );
					}
					?>
					<!-- end content -->
					<?php
					if ( $this->data['dataAfterContent'] ) {
						$this->html( 'dataAfterContent'
						);
					}
					?>
					</section>
					<aside class="usajobs-width-one-whole" role="complementary">
						<?php $this->renderPortals( $this->data['sidebar'] ); ?>
						<!-- ?php echo $this->getIndicators(); ? -->
	          <?php if ($this->data['loggedin']==1) { ?>
						<!-- content-actions -->
						<div>
							<h3>Page Actions</h3>
							<ul>
								<?php $lastkey = end(array_keys($this->data['content_actions']))
								?><?php foreach($this->data['content_actions'] as $key => $action) {
								?><li id="ca-<?php echo htmlspecialchars($key) ?>" <?php
									   if($action['class']) { ?>class="<?php echo htmlspecialchars($action['class']) ?>"<?php }
								?>><a href="<?php echo htmlspecialchars($action['href']) ?>"><?php echo htmlspecialchars($action['text']) ?></a>
									</li>
								<?php } ?>
							</ul>
						</div>
						<div>
							<h3>Wiki Account</h3>
	            <ul>
	              <?php $lastkey = end(array_keys($this->data['personal_urls'])) ?>
	              <?php foreach($this->data['personal_urls'] as $key => $item) { ?>
	              <li id="gumax-pt-<?php echo htmlspecialchars($key) ?>"><a href="<?php
	               echo htmlspecialchars($item['href']) ?>"<?php
	              if(!empty($item['class'])) { ?> class="<?php
	               echo htmlspecialchars($item['class']) ?>"<?php } ?>><?php
	               echo htmlspecialchars($item['text']) ?></a>
	               <?php //if($key != $lastkey) echo "|" ?></li>
	             <?php } ?>
	            </ul>
	          </div>
						<!-- end of content-actions -->
            <?php } ?>
					</aside><!-- end of aside -->
				</div>
				<footer class=""></footer>
			</main>

		<?php
		$this->printTrail();
		echo Html::closeElement( 'body' );
		echo Html::closeElement( 'html' );
		echo "\n";
		wfRestoreWarnings();
	} // end of execute() method

	/*************************************************************************************************/

	/**
	 * @param array $sidebar
	 */
	protected function renderPortals( $sidebar ) {
		if ( !isset( $sidebar['SEARCH'] ) ) {
			$sidebar['SEARCH'] = true;
		}
		if ( !isset( $sidebar['TOOLBOX'] ) ) {
		//	$sidebar['TOOLBOX'] = true;
		}
		if ( !isset( $sidebar['LANGUAGES'] ) ) {
			$sidebar['LANGUAGES'] = true;
		}

		foreach ( $sidebar as $boxName => $content ) {
			if ( $content === false ) {
				continue;
			}

			// Numeric strings gets an integer when set as key, cast back - T73639
			$boxName = (string)$boxName;

			if ( $boxName == 'SEARCH' ) {
				// $this->searchBox();
			} elseif ( $boxName == 'TOOLBOX' ) {
				// $this->toolbox();
			} elseif ( $boxName == 'LANGUAGES' ) {
				$this->languageBox();
			} else {
				$this->customBox( $boxName, $content );
			}
		}
	}

	function searchBox() {
		?>
		<div id="p-search" class="portlet" role="search">
			<div id="searchBody" class="pBody">
				<form action="<?php $this->text( 'wgScript' ) ?>" id="searchform">
					<input type='hidden' name="title" value="<?php $this->text( 'searchtitle' ) ?>"/>
					<?php echo $this->makeSearchInput( array( "id" => "searchInput" ) ); ?>

					<?php
					/*
					echo $this->makeSearchButton(
						"go",
						array( "id" => "searchGoButton", "class" => "searchButton" )
					);
					*/

					if ( $this->config->get( 'UseTwoButtonsSearchForm' ) ) {
						?>
						<?php echo $this->makeSearchButton(
							"fulltext",
							array( "id" => "mw-searchButton", "class" => "searchButton" )
						);
					} else {
						?>

						<div><a href="<?php
						$this->text( 'searchaction' )
						?>" rel="search"><?php $this->msg( 'powersearch-legend' ) ?></a></div><?php
					} ?>

				</form>

				<?php $this->renderAfterPortlet( 'search' ); ?>
			</div>
		</div>
	<?php
	}

	/**
	 * Prints the cactions bar.
	 * Shared between USAJOBS (MonoBook) and Modern
	 */
	function cactions() {
		?>
		<div id="p-cactions" class="portlet" role="navigation">
			<h3><?php $this->msg( 'views' ) ?></h3>

			<div class="pBody">
				<ul><?php
					foreach ( $this->data['content_actions'] as $key => $tab ) {
						echo '
				' . $this->makeListItem( $key, $tab );
					} ?>

				</ul>
				<?php $this->renderAfterPortlet( 'cactions' ); ?>
			</div>
		</div>
	<?php
	}

	/*************************************************************************************************/
	function toolbox() {
		?>
		<div class="portlet" id="p-tb" role="navigation">
			<h3><?php $this->msg( 'toolbox' ) ?></h3>

			<div class="pBody">
				<ul>
					<?php
					foreach ( $this->getToolbox() as $key => $tbitem ) {
						?>
						<?php echo $this->makeListItem( $key, $tbitem ); ?>

					<?php
					}
					Hooks::run( 'USAJOBSTemplateToolboxEnd', array( &$this ) );
					Hooks::run( 'SkinTemplateToolboxEnd', array( &$this, true ) );
					?>
				</ul>
				<?php $this->renderAfterPortlet( 'tb' ); ?>
			</div>
		</div>
	<?php
	}

	/*************************************************************************************************/
	function languageBox() {
		if ( $this->data['language_urls'] !== false ) {
			?>
			<div id="p-lang" class="portlet" role="navigation">
				<h3<?php $this->html( 'userlangattributes' ) ?>><?php $this->msg( 'otherlanguages' ) ?></h3>

				<div class="pBody">
					<ul>
						<?php foreach ( $this->data['language_urls'] as $key => $langlink ) { ?>
							<?php echo $this->makeListItem( $key, $langlink ); ?>

						<?php
}
						?>
					</ul>

					<?php $this->renderAfterPortlet( 'lang' ); ?>
				</div>
			</div>
		<?php
		}
	}

	/*************************************************************************************************/
	/**
	 * @param string $bar
	 * @param array|string $cont
	 */
	function customBox( $bar, $cont ) {
		$portletAttribs = array(
			'class' => 'generated-sidebar portlet',
			'id' => Sanitizer::escapeId( "p-$bar" ),
			'role' => 'navigation'
		);

		$tooltip = Linker::titleAttrib( "p-$bar" );
		if ( $tooltip !== false ) {
			$portletAttribs['title'] = $tooltip;
		}
		echo '	' . Html::openElement( 'div', $portletAttribs );
		$msgObj = wfMessage( $bar );
		?>

		<h3><?php echo htmlspecialchars( $msgObj->exists() ? $msgObj->text() : $bar ); ?></h3>
		<div class='pBody'>
			<?php
			if ( is_array( $cont ) ) {
				?>
				<ul>
					<?php
					foreach ( $cont as $key => $val ) {
						?>
						<?php echo $this->makeListItem( $key, $val ); ?>

					<?php
					}
					?>
				</ul>
			<?php
			} else {
				# allow raw HTML block to be defined by extensions
				print $cont;
			}

			$this->renderAfterPortlet( $bar );
			?>
		</div>
		</div>
	<?php
	}
} // end of class
