---
permalink: /working-in-government/unique-hiring-paths/federal-employees/internal/
layout: unique-hiring-path
section: working-in-government
title: Internal to an agency
breadcrumb: Internal
category: Unique Hiring Paths
tags: [internal, agency, hiring paths]
short-name: internal
---

{% assign hp_internal = site.data.unique-hiring-paths[page.short-name] %}

<div class="usajobs-uhp-section">
  <div class="usajobs-uhp-section__col-left">
    <h2 class="usajobs-uhp-section__title">Eligibility</h2>
  </div>
  <div class="usajobs-uhp-section__col-right">
    <p>
      Jobs open within the <a href="{{ site.baseurl }}/working-in-government/service/">competitive service</a> are open to current competitive service employees or those with a <a href="{{ site.baseurl }}/working-in-government/unique-hiring-paths/individuals-with-disabilities/">disability covered by schedule A</a>.
    </p>
    <p>
      Jobs open within the <a href="{{ site.baseurl }}/working-in-government/service/">excepted service</a> are open to to anyone within the agency. This also includes employees who can be <a href="{{ site.baseurl }}/working-in-government/unique-hiring-paths/federal-employees/reinstatement/">reinstated</a>.
    </p>
  </div>
</div>

<div class="usajobs-uhp-section">
  <div class="usajobs-uhp-section__col-left">
    <h2 class="usajobs-uhp-section__title">
      How do I know if a job is open only internally?
    </h2>
  </div>
  <div class="usajobs-uhp-section__col-right">
    <p>
      In the job announcement look for the <strong>This job is open to</strong> section. When the job is open only to current employees of the agency, you’ll see the internal icon <span class="usajobs-uhp-section__filters-uhp-icon internal"><i class="fa fa-{{ hp_internal.icon }}"></i></span>. There may be other groups listed that can also apply.
    </p>
    <p>
      You can also select the <strong>Internal to an agency</strong> filter in search. Your results will display all jobs open only to current employees of the hiring agency.
    </p>
  </div>
</div>

{% include components/unique-hiring-paths/search-inner.html page=page.short-name %}
